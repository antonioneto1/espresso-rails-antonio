class UsersController < ApplicationController
  before_action :authenticate_user!

  def index
    @users = policy_scope(User)
    authorize @users
  end

  def new
    @companies = Company.all
    authorize User
  end

  def create
    @user = User.new(user_params)
    authorize User

    if @user.save
      UserMailer.welcome_email(@user, @user.password).deliver_later
      render json: { message: 'User was successfully created' }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :role, :company_id, :password, :password_confirmation)
  end
end
