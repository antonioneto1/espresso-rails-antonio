# frozen_string_literal: true

class CardPolicy < ApplicationPolicy
  def create?
    user.admin?
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user.admin?
        user.where(company: user.company)
      else
        user.where(user: user)
      end
    end
  end
end
