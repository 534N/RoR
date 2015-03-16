class TestController < ApplicationController
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def parse
  	# require 'rubygems'
  	require 'open-uri'
  	# require 'htmlentities'
  	require 'pp'

  	page = Nokogiri::HTML(open("http://www.cheapthrills.ca/news.html"))
  	rows = page.xpath("//table[@border]/tr")

  	@details = rows.collect do |row|
	  detail = {}
	  [
	    [:status, 'td[1]/font/text()'],
	    [:artist, 'td[2]/font/text()'],
	    [:date, 'td[3]/font/text()'],
	    [:time, 'td[4]/font/text()'],
	    [:venue, 'td[5]/font/text()'],
	    [:price, 'td[6]/font/text()']
	  ].each do |name, xpath|
	  	# 
	  	# ISSUE: 
	  	# 
	  	# 	since HTMLEntities cannot be loaded, I cannot do html decode:
	  	# 
	  	# 		detail[name] = HTMLEntities.new.decode row.at_xpath(xpath).to_s.strip
	  	# 
	  	# 	this is going to relay the decode task to javascript, which is not ideal
	  	# 
	  	detail[name] = row.at_xpath(xpath).to_s.strip
	  end
	  detail
	end
  end
end