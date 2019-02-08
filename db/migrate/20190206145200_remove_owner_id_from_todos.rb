class RemoveOwnerIdFromTodos < ActiveRecord::Migration[5.2]
  def change
    remove_column :todos, :owner_id
  end
end
