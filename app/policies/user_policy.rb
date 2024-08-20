# frozen_string_literal: true

class UserPolicy < ApplicationPolicy
  def index?
    user.admin?
  end

  def create?
    user.admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user.company_id.present?
        scope.where(company_id: user.company_id)
      else
        scope.all
      end
    end
  end
end
