
class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def hello
  	render text: 'hello, world'
  end

  def parse
  	require 'open-uri'
  	require 'pp'

  	page = Nokogiri::HTML(open("http://www.cheapthrills.ca/news.html"))
  	rows = page.xpath("//table[@border]/tr")

  	details = rows.collect do |row|
	  detail = {}
	  [
	    [:status, 'td[1]/font/text()'],
	    [:artist, 'td[2]/font/text()'],
	    [:date, 'td[3]/font/text()'],
	    [:time, 'td[4]/font/text()'],
	    [:venue, 'td[5]/font/text()'],
	    [:price, 'td[6]/font/text()']
	  ].each do |name, xpath|
	  	detail[name] = row.at_xpath(xpath).to_s.strip
	  end
	  detail
	end
	pp details

  end
end
