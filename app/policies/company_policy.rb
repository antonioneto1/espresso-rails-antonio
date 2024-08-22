# frozen_string_literal: true

class CompanyPolicy < ApplicationPolicy
  def index
    true
  end

  def create?
    user.admin?
  end
end
