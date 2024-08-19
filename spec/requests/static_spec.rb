require 'rails_helper'

RSpec.describe "Statics", type: :request do
  describe "GET /home" do
    it "returns http success" do
      get "/static/home"
      expect(response).to have_http_status(:success)
    end
  end

  describe "GET /admin_registration" do
    it "returns http success" do
      get "/static/admin_registration"
      expect(response).to have_http_status(:success)
    end
  end

end
