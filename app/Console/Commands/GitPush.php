<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;

class GitPush extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
     protected $signature = 'git:push
                            {commit? : The commit description, default current date}
                            {branch? : The branch repository, default master}
                            {--compile= : Compile assets before make push}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'make custom git push to remote repository';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        $commit = $this->argument('commit') ?: Carbon::now()->format('YmdHi');
        $branch = $this->argument('branch') ?: 'master';

        if($this->option('compile'))
        {
            $this->line('compile assets..');
            exec('npm run prod');
        }

        $this->line('making git add');
        exec('git add --all');

        $this->line('making git commit');
        exec('git commit -m '.$commit);

        $this->line('making git push');
        exec('git push origin '.$branch);

        $this->info('done!');
    }
}
