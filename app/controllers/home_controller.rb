# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :authenticate_user!
  after_action :verify_authorized, except: [:index]

  def index
    current_user.present?
  end
end
