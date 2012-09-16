class << Dir
  def exists?(path)
    File.exists? path
  end
end unless Dir.respond_to? :exists?

task :build do
  Dir.mkdir 'build' unless Dir.exists? 'build'
  Dir.chdir 'build' do
    chrome '--no-message-box --pack-extension=.. --pack-extension-key=../key.pem'
  end
end

task :default => :build

# Utils
# -----

def chrome(*args)
  system ['chrome', *args].join(' ')
end