using System;

namespace terminalApp.Common
{
    public class ProcessStartEventArgs : EventArgs
    {
        public String ErrorMessage { get; set; }
    }
}