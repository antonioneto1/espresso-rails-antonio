# frozen_string_literal: true

class Company < ApplicationRecord
  has_many :users
  has_many :cards
  has_many :statements

  validates :name, presence: true
  validates :cnpj, format: /\A\d{14}\z/, uniqueness: true, presence: true
end
