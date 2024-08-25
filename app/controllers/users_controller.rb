# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_company
  before_action :authorize_user, only: %i[index create update]

  def index
    @users = @company.users.where(role: :employee)
    authorize @users
    render json: { employees: @users.as_json(only: [:id, :name, :email]) }
  end

  def create
    @user = @company.users.build(user_params)
    authorize @user

    if @user.save
      generated_password = @user.password
      UserMailer.welcome_email(@user, generated_password).deliver_later
      render json: { message: 'Funcionário cadastrado com sucesso!' }, status: :created
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    @user = @company.users.find(params[:id])
    authorize @user

    if @user.update(user_params)
      render json: { message: 'Funcionário atualizado com sucesso!' }
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_company
    @company = Company.find(current_user.company_id)
  end

  def authorize_user
    authorize User
  end

  def user_params
    params.require(:employee).permit(:name, :email, :role)
  end
end
