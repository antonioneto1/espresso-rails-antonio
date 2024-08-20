# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  describe 'validations' do
    it { is_expected.to validate_presence_of(:name) }

    context 'when admin' do
      subject { build(:user, role: :admin) }

      it { is_expected.not_to validate_presence_of(:company) }
    end

    context 'when employee' do
      subject { build(:user, role: :employee) }

      it { is_expected.to validate_presence_of(:company) }
    end
  end
end
