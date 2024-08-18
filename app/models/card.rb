class Card < ApplicationRecord
  belongs_to :user
  has_one :company, through: :user

  validates :user_id, uniqueness: true
  validates :last4, format: /\A\d{4}\z/, presence: true
end
