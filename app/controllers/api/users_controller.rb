class Api::UsersController < ApplicationController

  def index
    if params[:server_id]
      @users = Server.find_by(id: params[:server_id]).members
    else
      @users = User.all
    end
    render :index
  end

  def show
    @user = User.find_by(id: params[:id])
    render :show
  end

  def create
    @user = User.new(user_params)
    if @user.save
      login(@user)
      render :show
    else
      render json: @user.errors, status:422
    end
  end

  def update
    if current_user && params[:id].to_i == current_user.id
      @user = current_user
      errors = {}
      if params["oldPW"] && params["oldPW"].length > 1 || params["newPW"] && params["newPW"].length > 1
        @user.change_password!(params["oldPW"], params["newPW"])
        errors = @user.errors.messages.dup
      end
      if @user.update_attributes(user_params) && errors.empty?
        render :show
      else
        all_errors = @user.errors.messages.merge(errors)
        render json: all_errors, status:422 
      end
    end
  end

  def destroy
    if current_user && params[:id].to_i == current_user.id
      @user = current_user
      current_user.destroy
      session[:session_token] = nil
      render :show
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :photo)
  end
end