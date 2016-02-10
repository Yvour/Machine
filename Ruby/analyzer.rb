#!/bin/env ruby
# encoding: utf-8

prm = ARGV;

def str_to_presenceHash(str, divider='')
  the_divider = '';
  the_divider = divider if divider;
  the_sym = str.split(the_divider).inject({}) {|r,x| r[x] = 1; r};
  the_sym
end

class Analyzer
  def initialize(params={})
    
    #default valeus
    @letters = (('a'..'z').to_a.join('') + ('A'..'Z').to_a.join('')) + '_$';
    @digits  = (0..9).to_a.join('');
    @quotes  = "'\"`~";
    @spaces  = "\t ";
    @reserved = 'mov goto add codesegmend begin end datasegment';
    @code  = '';
    
    @letters = params['letters'] if params['letters']
    @digits  = params['digits'] if params['digits']
    @quotes  = params['quotes'] if params['quotes']
    @spaces = params['spaces'] if params['spaces']
    @reserved = params['reserved'] if params['reserved']
    @code = File.open(params['filename'], 'r'){|read| read.read} if params['filename']
    
    @letters = str_to_presenceHash(@letters);
    @digits = str_to_presenceHash(@digits);
    @quotes = str_to_presenceHash(@quotes);
    @spaces = str_to_presenceHash(@spaces);
    @reserved = str_to_presenceHash(@reserved, ' ');
    
    @alphabeth = @letters.merge(@digits);
    @is_log = false;
  end
  
  def getWord(string, beg)

    i = beg;
    while @alphabeth[string[i]]
      i+=1;
      # puts "#{i}"
    end
    return {'value'=>string[beg..i-1], 'index'=>i, 'type'=>'word', 'error'=>''}
  end
  
  def getInteger(string, beg)
    i = 0
    while @digits[string[i]]
      i+=1;
    end
    return {'value'=>string[beg..i-1], 'index'=>i, 'type'=>'integer', 'error'=>''}
  end
  
  def getLiteral(string, beg)
    p "getLiteral:start" if @is_log
    quot = string[beg];
    backslash = '\\';
    curr = string[beg]
    prev = string[beg]
    string_ended = false;
    literal_closed = false;
    i = beg;
    while !string_ended & !literal_closed
      i+=1;
      curr = string[i];
      if curr == backslash
          prev = curr
          i+=1;
      end
      if curr == quot && prev != backslash
        i+=1   
        literal_closed = 1
      elsif i >= string.size
        string_ended = true
        
      end
      
    end #of while !string_ended & !literal_closed
    error = '';
    error = 'literal not closed' if string_ended && !literal_closed
    p "getLiteral:end" if @is_log
    return {'value'=>string[beg..i-1], 'index'=>i, 'type'=>'literal', 'error'=>''}
  end
  
  def getElements(string)

    result = {};
    result['elements'] = [];
    res = {};
    i = 0;
    len = string.size
    while i < len
      i+=1 if @spaces[string[i]]
      puts "index is #{i}" if @is_log

      if @letters[string[i]]
        res = getWord(string, i)
      elsif @digits[string[i]]
        res = getInteger(string, i)
      elsif @quotes[string[i]]
        res = getLiteral(string, i)
      end
      i = res['index'];
      result['elements'].push(res);
      if res['error'] !=''
  result['error'] = res.error;
  return result;
  
      end
      
    end
    return result;
  end
  
end

a = Analyzer.new()

text = a.getElements('Sir Walter Scott of "Abbotsworth and \"Lynd\" Castle"');
p text

