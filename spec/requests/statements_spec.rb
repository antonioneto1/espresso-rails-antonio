# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'UsersController' do
  let!(:user) { create(:user, role: :admin) }
  let!(:statement) { create(:statement) }

  before { sign_in(user) }

  describe 'PATCH /statements/:id' do
    let(:params) { { statement: { archived: true } } }

    it 'returns http ok' do
      patch("/statements/#{statement.id}", params: params)

      expect(response).to have_http_status(:ok)
    end

    it 'updates archived status' do
      expect { patch("/statements/#{statement.id}", params: params) }.to change { statement.reload.archived }.from(false).to(true)
    end
  end
end