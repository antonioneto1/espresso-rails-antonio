# frozen_string_literal: true

class StatementPolicy < ApplicationPolicy
  def index?
    true
  end

  def update?
    true
  end

  def attach_invoice?
    user.employee? && record.card == user.card
  end

  def archived?
    user.admin?
  end

  def permitted_attributes_for_update
    [:category_id]
  end

  def archived_list?
    true
  end

  class Scope < ApplicationPolicy::Scope
    def resolve
      if user.admin?
        scope.joins(:company).where(companies: { id: user.company })
      else
        Statement.where(card: user.card)
      end
    end
  end
end
