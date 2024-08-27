# frozen_string_literal: true

module AuthHelpers
  def sign_in_as(user)
    post user_session_path, params: { user: { email: user.email, password: user.password } }
  end
end
