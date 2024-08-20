# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'UsersController' do
  let!(:user) { create(:user, role: :admin) }
  let!(:company) { create(:company) }

  before { sign_in(user) }

  describe 'POST /users' do
    let(:params) do
      {
        user: {
          name: Faker::Name.name,
          email: Faker::Internet.unique.email,
          role: User::ROLES.keys.sample,
          company_id: company.id
        }
      }
    end

    it 'returns http created' do
      post("/users", params: params)

      expect(response).to have_http_status(:created)
    end

    it 'saves user' do
      expect { post("/users", params: params) }.to change(User, :count).by(1)
    end

    context 'with invalid params' do
      let(:params) do
        {
          user: {
            name: Faker::Name.name,
            email: '',
            role: ''
          }
        }
      end

      it 'returns bad request' do
        post("/users", params: params)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'GET /companies/:id/users' do
    before { create_list(:user, 4, company: company) }

    it 'returns http ok' do
      get("/companies/#{company.id}/users")

      expect(response).to have_http_status(:ok)
    end
  end
end
