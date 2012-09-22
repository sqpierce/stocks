# utility to munge data into single file for insertion into Mongo
# ruby to_json.rb > stock_data.json 2> to_json.log

require 'csv'

DEBUG=false

dir='data'
count = 0

Dir.entries(dir).each do |file|
  next if file =~ /\./ # skip directories
  File.readlines("#{dir}/#{file}").each do |line|
    next if line =~ /^\s*#/ # skip comments
    break if count > 10 && DEBUG # testing only (read 10 lines)
    @fields = CSV.parse(line)[0]
    warn @fields.inspect if DEBUG # to STDOUT
    time_str = @fields.slice!(2,2).join(' ')
    warn time_str if DEBUG
    begin # NOTE: some of the data has badly formatted dates
      date = DateTime.strptime(time_str, '%m/%d/%Y %H:%M%P')
      warn date.strftime '%Y-%m-%d %H:%M' if DEBUG
      secs = date.to_time.to_i * 1000 # NOTE: must convert seconds to milliseconds
    rescue
      warn "#{file} - #{time_str} - #{line}" # prints to STDERR
      next
    end
    begin
      match = @fields[6].match /([+-]*\d+\.\d+)/
      change = match[1].to_f # convert change to float
      warn "change: #{@fields[6]} -> #{match.inspect} -> #{change}" if DEBUG
    rescue
      warn "no match for change on: #{line}"
      change = nil
    end
    # NOTE: $date must be in double quotes
    puts "{ symbol: \"#{@fields[0]}\", name: \"#{@fields[1]}\", price: #{@fields[2].to_f}, dividend_yield: #{@fields[3].to_f}, p_e_ratio: #{@fields[4].to_f}, volume: #{@fields[5].to_i}, day_value_change: #{change}, previous_close: #{@fields[7].to_f}, last_trade_time: { \"$date\": #{secs} } }" # json to stdout
    count+=1
  end
  break if DEBUG # testing only (quit after first file)
end

# mongoimport --db stocks --collection price --type json --file stock_data.csv
