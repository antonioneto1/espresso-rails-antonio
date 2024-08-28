# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Categories' do
  let(:user) { create(:user, role: :admin) }
  let(:company) { create(:company) }
  let(:category) { create(:category, company: company) }

  before do
    sign_in user
  end

  describe 'GET /companies/:company_id/categories' do
    it 'returns a list of categories for a company' do
      get company_categories_path(company_id: company.id)

      expect(response).to have_http_status(:ok)
      expect(response.content_type).to eq('application/json')

      json_response = response.parsed_body
      expect(json_response['categories']).to be_an(Array)
      expect(json_response['categories'].first).to include('name', 'id') if json_response['categories'].any?
    end
  end

  describe 'GET /companies/:company_id/categories/new' do
    it 'renders the new template' do
      get new_company_category_path(company_id: company.id)

      expect(response).to have_http_status(:ok)
    end
  end

  describe 'POST /companies/:company_id/categories' do
    context 'with valid parameters' do
      let(:valid_params) do
        { category: { name: 'New Category', company_id: company.id } }
      end

      it 'creates a new category' do
        expect do
          post company_categories_path(company_id: company.id), params: valid_params
        end.to change(Category, :count).by(1)

        expect(response).to have_http_status(:ok)
        json_response = response.parsed_body
        expect(json_response['message']).to eq('Category was successfully created.')
      end
    end

    context 'with invalid parameters' do
      before do
        sign_in user
        post company_categories_path(company_id: company.id), params: invalid_params
      end

      let(:invalid_params) do
        { category: { name: '', company_id: '' } }
      end

      it 'does not create a new category' do
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = response.parsed_body
        expect(json_response['errors']).to include("Name can't be blank")
      end
    end
  end
end
