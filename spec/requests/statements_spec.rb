require 'rails_helper'

RSpec.describe StatementsController, type: :controller do
  let(:company) { create(:company) }
  let(:admin) { create(:user, :admin, company: company) }
  let(:employee) { create(:user, :employee, company: company) }
  let(:card) { create(:card, user: employee, company: company) }
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

  describe "PUT #update" do
    before do
      sign_in admin
    end

    it "updates the statement when authorized" do
      put :update, params: { company_id: company.id, id: statement.id, archived: true }
      expect(response).to have_http_status(:success)
      expect(statement.reload.archived).to be_truthy
    end

    it "does not update the statement when not authorized" do
      sign_in employee
      put :update, params: { company_id: company.id, id: statement.id, archived: true }
      expect(response).to have_http_status(:forbidden)
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
        expect(response).to have_http_status(:forbidden)
        expect(statement.reload.invoice.attached?).to be_falsey
      end
    end
  end
end
