# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Statement do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:cost) }
    it { is_expected.to validate_presence_of(:merchant) }
    it { is_expected.to validate_presence_of(:performed_at) }
    it { is_expected.to validate_presence_of(:transaction_id) }
  end
end
