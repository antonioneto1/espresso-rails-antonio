# frozen_string_literal: true

class UserMailer < ApplicationMailer
  default from: 'suporte@espressoapp.com.br'

  def welcome_email(user, password)
    @user = user
    @password = password
    @url = Rails.application.credentials.frontend_url
    mail(to: @user.email, subject: 'Bem-vindo ao Espresso!')
  end
end
