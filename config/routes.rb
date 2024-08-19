# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  authenticated :user do
    root to: 'statements#index'
  end

  root to: redirect("/users/sign_in")

  scope 'users/:user_id' do
    resources :cards, only: %i[new create]
  end

  namespace 'api' do
    namespace 'baas' do
      post 'webhook'
    end
  end

  resources :statements, only: %i[edit update] do
    patch 'attach_invoice'
  end

  resources :users, only: %i[new create]

  resources :companies, only: %i[new create] do
    resources :users, only: %i[index]
    resources :categories, only: %i[new create]
    resources :statements, only: :index
  end
end
