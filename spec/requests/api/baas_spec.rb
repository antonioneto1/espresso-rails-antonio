# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'BaasController' do
  let!(:user) { create(:user, role: :admin) }

  before { sign_in(user) }

  describe 'POST /api/baas/webhooks' do
    let!(:card) { create(:card, last4: '1234') }
    let(:params) do
      {
        'merchant' => 'Uber *UBER *TRIP',
        'cost' => 1790,
        'created_at' => '2024-07-04 12:15:52 -03:00',
        'last4' => '1234',
        'transaction_id' => '3e85a730-bb1f-451b-9a39-47c55aa054db'
      }
    end

    it 'returns http created' do
      post('/api/baas/webhooks', params: params)

      expect(response).to have_http_status(:created)
    end

    it 'saves statement', :aggregate_failures do
      expect { post('/api/baas/webhooks', params: params) }.to change(Statement, :count).by(1)
      expect(Statement.last.attributes).to include(
        {
          'merchant' => 'Uber *UBER *TRIP',
          'cost' => 1790,
          'performed_at' => Time.parse('2024-07-04 12:15:52 -0300'),
          'card_id' => card.id,
          'transaction_id' => '3e85a730-bb1f-451b-9a39-47c55aa054db'
        }
      )
    end
  end
end
