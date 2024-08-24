# frozen_string_literal: true

FactoryBot.define do
  factory :statement do
    cost { Faker::Commerce.price }
    merchant { Faker::Company.name }
    performed_at { Faker::Date.backward(days: 30) }
    transaction_id { Faker::Number.unique.number(digits: 10) }
    card

    trait :archived do
      archived { true }
    end

    trait :active do
      archived { false }
    end
  end
end
