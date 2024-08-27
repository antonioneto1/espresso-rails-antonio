# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Cards', type: :request do
  let(:user) { create(:user, role: :admin) }
  let(:company) { create(:company) }
  let(:card) { create(:card, company: company, user: user) }

  before do
    sign_in user
  end

  let(:csrf_token) do
    get company_cards_path(company_id: company.id)
    response.headers['X-CSRF-Token']
  end

  describe 'GET /companies/:company_id/cards' do
    it 'returns a list of cards' do
      get company_cards_path(company_id: company.id)

      expect(response).to have_http_status(:ok)
      expect(response.content_type).to eq('application/json')

      json_response = JSON.parse(response.body)
      expect(json_response['cards']).to be_an(Array)
    end
  end

  describe 'POST /companies/:company_id/cards' do
    context 'with valid parameters' do
      let(:valid_params) { { card: { last4: '1234', user_id: user.id } } }

      it 'creates a new card' do
        expect {
          post company_cards_path(company_id: company.id), params: valid_params, headers: { "X-CSRF-Token" => csrf_token }
        }.to change(Card, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(response.content_type).to eq('application/json')
        json_response = JSON.parse(response.body)
        expect(json_response['message']).to eq('Card was successfully created.')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) { { card: { last4: '', user_id: '' } } }

      it 'does not create a new card' do
        expect {
          post company_cards_path(company_id: company.id), params: invalid_params, headers: { "X-CSRF-Token" => csrf_token }
        }.not_to change(Card, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.content_type).to eq('application/json')
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("User must exist", "Last4 is invalid", "Last4 can't be blank")
      end
    end
  end
end