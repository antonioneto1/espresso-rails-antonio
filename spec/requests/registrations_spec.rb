require 'rails_helper'

RSpec.describe "Registrations", type: :request do
  describe "GET /new_admin" do
    it "returns http success" do
      get "/registrations/new_admin"
      expect(response).to have_http_status(:success)
    end
  end

end
