# frozen_string_literal: true

class RegistrationsController < Devise::RegistrationsController
  def new
    @user = User.new
    @company = Company.new
  end

  def create
    @company = Company.new(company_params)
    @user = User.new(user_params)
    @user.company = @company
    if @company.save && @user.save
      UserMailer.welcome_email(@user, @user.password).deliver_later
      redirect_to root_path, notice: 'Conta criada com sucesso!'
    else
      render :new, notice: 'Houve um erro ao criar a conta. Verifique os dados e tente novamente.'
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :name, :password, :password_confirmation)
  end

  def company_params
    params.require(:company).permit(:name, :cnpj)
  end
end
