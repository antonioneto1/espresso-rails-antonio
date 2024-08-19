class Company < ApplicationRecord
  has_many :users
  has_many :cards
  has_many :statements

  validates :name, presence: true
  validates :cnpj, presence: true
end
