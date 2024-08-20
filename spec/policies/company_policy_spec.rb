# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CompanyPolicy, type: :policy do
  subject { described_class }

  let(:user) { build(:user, role: :employee) }
  let(:admin_user) { build(:user, role: :admin) }

  permissions :create? do
    it { is_expected.to permit(admin_user) }
    it { is_expected.not_to permit(user) }
  end
end
