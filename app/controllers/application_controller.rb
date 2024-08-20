class ApplicationController < ActionController::Base
  include Pundit::Authorization

  after_action :verify_authorized, unless: :devise_controller?

  rescue_from ActionController::ParameterMissing, with: -> { head :bad_request }
  rescue_from Pundit::NotAuthorizedError, with: -> { head :unauthorized }

  private

  def devise_controller?
    self.class.ancestors.include?(DeviseController)
  end
end
