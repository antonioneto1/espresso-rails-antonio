# frozen_string_literal: true

class CategoryPolicy < ApplicationPolicy
  def index?
    true
  end

  def create?
    user.admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      Category.where(company_id: user.company_id)
    end
  end
end
