# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pundit::Authorization

  after_action :verify_authorized, unless: :devise_controller?

  rescue_from ActionController::ParameterMissing, with: -> { head :bad_request }
  rescue_from Pundit::NotAuthorizedError, with: -> { head :unauthorized }

  private

  def devise_controller?
    self.class.ancestors.include?(DeviseController)
  end

  def after_sign_in_path_for(resource)
    home_index_path
  end
end
