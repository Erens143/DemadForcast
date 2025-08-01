from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..schemas.auth import UserCreate, Token, User as UserSchema
from ..utils.security import get_password_hash, verify_password, create_access_token
from ..dependencies import get_current_active_user

router = APIRouter(tags=["authentication"])

@router.post("/register", response_model=dict)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return {"message": "User created successfully"}

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login user and return access token"""
    # Find user by email
    user = db.query(User).filter(User.email == form_data.username).first()
    
    # Verify password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user.email})
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def get_current_user_info(
    current_user: User = Depends(get_current_active_user)
):
    """Get current user information"""
    return current_user 