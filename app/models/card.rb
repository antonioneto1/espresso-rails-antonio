# frozen_string_literal: true

class Card < ApplicationRecord
  belongs_to :user
  has_one :company, through: :user

  validates :user_id, uniqueness: true
  validates :last4, format: /\A\d{4}\z/, presence: true

  def card_map
    {
      id: id,
      name: user.name,
      last4: last4
    }
  end
end
