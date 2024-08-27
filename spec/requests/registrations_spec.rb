require 'rails_helper'

RSpec.describe 'Registrations' do
  let(:valid_user_params) do
    {
      user: {
        email: 'user@example.com',
        name: 'Test User',
        password: 'password123',
        password_confirmation: 'password123'
      },
      company: {
        name: 'Test Company',
        cnpj: '12345678000195'
      }
    }
  end

  let(:invalid_user_params) do
    {
      user: {
        email: '',
        name: 'Test User',
        password: 'short',
        password_confirmation: 'different'
      },
      company: {
        name: 'Test Company',
        cnpj: ''
      }
    }
  end

  describe 'GET /users/sign_up' do
    it 'renders the registration form' do
      get new_user_registration_path

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /users' do
    context 'with valid parameters' do
      it 'creates a new user and company' do
        expect {
          post user_registration_path, params: valid_user_params
        }.to change(User, :count).by(1).and change(Company, :count).by(1)

        expect(response).to redirect_to(root_path)
        expect(flash[:notice]).to eq('Conta criada com sucesso!')
      end
    end

    context 'with invalid parameters' do
      before do
        post user_registration_path, params: invalid_user_params
      end

      it 'does not create a new user or company' do
        expect(User.count).to eq 0
      end
    end
  end
end
