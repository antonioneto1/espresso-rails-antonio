# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'UsersController' do
  let!(:user) { create(:user, role: :admin) }
  let!(:company) { create(:company) }

  before { sign_in(user) }

  describe 'GET /companies/:id/users' do
    before { create_list(:user, 4, company: company) }

    it 'returns http ok' do
      get("/companies/#{company.id}/users")

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'when user is not admin' do
    let!(:user) { create(:user, role: :employee) }
    before { sign_in(user) }

    it 'returns forbidden' do
      get("/companies/#{company.id}/users")

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
