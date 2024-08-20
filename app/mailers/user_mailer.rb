class UserMailer < ApplicationMailer
  default from: 'no-reply@yourdomain.com'

  def welcome_email(user, password)
    @user = user
    @password = password
    mail(to: @user.email, subject: 'Welcome to Our Platform')
  end
end
