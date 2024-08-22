# frozen_string_literal: true

class StatementPolicy < ApplicationPolicy
  def index?
    true
  end

  def update?
    user.present?
  end

  def attach_invoice?
    user.employee? && record.card == user.card
  end

  def permitted_attributes_for_update
    if user.admin?
      [:archived]
    else
      [:category_id]
    end
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
