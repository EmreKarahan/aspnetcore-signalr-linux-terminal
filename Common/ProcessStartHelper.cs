
using System;
using System.Diagnostics;

namespace terminalApp.Common
{
    public class ProcessStartHelper
    {
        public event DataReceivedEventHandler OutputDataReceived;
        public event DataReceivedEventHandler ErrorDataReceived;
        public event EventHandler Exited;
        public event EventHandler<ProcessStartEventArgs> Error;

        public string Execute(string cmd)
        {
            try
            {

                ProcessStartInfo psi = new ProcessStartInfo()
                {
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    FileName = "sh",
                    Arguments = $"-c \"{cmd}\""
                };


                Process ffProcess = new Process { StartInfo = psi };

                ffProcess.EnableRaisingEvents = true;
                ffProcess.OutputDataReceived += OutputDataReceived;
                ffProcess.ErrorDataReceived += ErrorDataReceived;
                ffProcess.Exited += Exited;


                ffProcess.Start();

                ffProcess.BeginOutputReadLine();
                ffProcess.BeginErrorReadLine();
                ffProcess.WaitForExit();

                return string.Empty;
            }
            catch (Exception ex)
            {
                ProcessStartEventArgs args = new ProcessStartEventArgs();
                args.ErrorMessage = ex.Message;
                OnError(args);
            }
            return string.Empty;
        }

        protected virtual void OnError(ProcessStartEventArgs e)
        {
            EventHandler<ProcessStartEventArgs> handler = Error;
            if (handler != null)
            {
                handler(this, e);
            }
        }
    }
}