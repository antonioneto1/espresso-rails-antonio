# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Home', type: :request do
  let(:user) { create(:user, role: :admin) }

  describe 'GET /' do
    context 'when user is authenticated' do
      before do
        sign_in user
        get root_path
      end

      it 'returns a success response' do
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when user is not authenticated' do
      before do
        get root_path
      end

      it 'redirects to the sign-in page' do
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end
end
