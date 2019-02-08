class Todo < ApplicationRecord
  validates_presence_of :title, :start
end
