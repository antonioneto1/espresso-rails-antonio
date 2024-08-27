# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'Statements', type: :request do
  let(:company) { create(:company) }
  let(:admin) { create(:user, :admin, company: company) }
  let(:employee) { create(:user, :employee, company: company) }
  let(:statement) { create(:statement, card: create(:card, user: employee, company: company)) }
  let(:file) { fixture_file_upload('spec/fixtures/test_invoice.pdf', 'application/pdf') }

  describe 'GET /companies/:company_id/statements' do
    context 'when the user is an admin' do
      before do
        sign_in admin
        get company_statements_path(company)
      end

      it 'returns a list of archived and active statements' do
        expect(response).to have_http_status(:success)
        # Adapte conforme o formato da resposta
        expect(response.body).to include('completed_statements')
        expect(response.body).to include('open_statements')
      end
    end

    context 'when the user is an employee' do
      before do
        sign_in employee
        get company_statements_path(company)
      end

      it 'returns a list of user statements' do
        expect(response).to have_http_status(:success)
        expect(response.body).to include('statements')
      end
    end
  end

  describe 'POST /companies/:company_id/statements/:id/archived' do
    context 'when authorized' do
      before do
        sign_in admin
        post archived_company_statement_path(company, statement), params: { archived: true }
      end

      it 'updates the statement' do
        expect(response).to have_http_status(:success)
        expect(statement.reload.archived).to be_truthy
      end
    end

    context 'when not authorized' do
      before do
        sign_in employee
        post archived_company_statement_path(company, statement), params: { archived: true }
      end

      it 'does not archive the statement' do
        expect(response).to have_http_status(:unauthorized)
        expect(statement.reload.archived).to be_falsy
      end
    end
  end

  describe 'PATCH /companies/:company_id/statements/:statement_id/attach_invoice' do
    context 'when authorized' do
      before do
        sign_in employee
        patch company_statement_attach_invoice_path(company, statement), params: { file: file }
      end

      it 'attaches the invoice to the statement' do
        expect(response).to have_http_status(:success)
        expect(statement.reload.invoice).to be_attached
      end
    end

    context 'when not authorized' do
      before do
        sign_in admin
        patch company_statement_attach_invoice_path(company, statement), params: { file: file }
      end

      it 'does not allow attaching the invoice' do
        expect(response).to have_http_status(:unauthorized)
        expect(statement.reload.invoice).not_to be_attached
      end
    end
  end
end