class Statement < ApplicationRecord
  belongs_to :card
  belongs_to :category, optional: true
  has_one :attachment

  validates :performed_at, :cost, :merchant, :transaction_id, presence: true
end
