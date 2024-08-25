# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StatementsController, type: :controller do
  let(:company) { create(:company) }
  let(:another_company) { create(:company) }
  let(:admin) { create(:user, :admin, company: company) }
  let(:employee) { create(:user, :employee, company: company) }
  let(:card) { create(:card, user: employee, company: company) }
  let(:another_card) { create(:card, company: another_company) }
  let(:another_employee) { create(:user, :employee, company: another_company) }
  let(:statement) { create(:statement, card: card) }

  before do
    sign_in admin
  end

  describe "GET #index" do
    context "when the user is an admin" do
      before do
        get :index, params: { company_id: company.id }
      end

      it "returns a list of archived and active statements" do
        expect(response).to have_http_status(:success)
        expect(json_response).to have_key("completed_statements")
        expect(json_response).to have_key("open_statements")
      end
    end

    context "when the user is an employee" do
      before do
        sign_in employee
        get :index, params: { company_id: company.id }
      end

      it "returns a list of user statements" do
        expect(response).to have_http_status(:success)
        expect(json_response).to have_key("statements")
      end
    end
  end

  describe "POST #archived" do
    it "updates the statement when authorized" do
      sign_in admin
      post :archived, params: { company_id: company.id, id: statement.id, archived: true }
      expect(response).to have_http_status(:success)
      expect(statement.reload.archived).to be_truthy
    end

    it "does not archived the statement when employee" do
      sign_in employee

      post :archived, params: { company_id: company.id, id: statement.id, archived: true }
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST #attach_invoice" do
    let(:file) { fixture_file_upload('spec/fixtures/test_invoice.pdf', 'application/pdf') }

    context "when authorized" do
      before do
        sign_in employee
        post :attach_invoice, params: { company_id: company.id, statement_id: statement.id, file: file }
      end

      it "attaches the invoice to the statement" do
        expect(response).to have_http_status(:success)
        expect(statement.reload.invoice.attached?).to be_truthy
      end
    end

    context "when not authorized" do
      before do
        sign_in admin
        post :attach_invoice, params: { company_id: company.id, statement_id: statement.id, file: file }
      end

      it "does not allow attaching the invoice" do
        expect(response).to have_http_status(:unauthorized)
        expect(statement.reload.invoice.attached?).to be_falsey
      end
    end
  end
end
