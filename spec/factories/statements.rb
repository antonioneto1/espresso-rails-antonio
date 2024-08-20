# frozen_string_literal: true

FactoryBot.define do
  factory :statement do
    performed_at { Faker::Time.backward }
    cost { Faker::Number.between(from: 0, to: 10_000_000) }
    merchant { Faker::Company.name }
    transaction_id { Faker::Alphanumeric.unique.alphanumeric(number: 15) }
    category { nil }
    card
  end
end
