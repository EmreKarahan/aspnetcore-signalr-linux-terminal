using Newtonsoft.Json;

public class WelcomeModel
{

    [JsonProperty("host")]
    public string MachineName { get; set; }

    [JsonProperty("user")]
    public string Username { get; set; }


    [JsonProperty("currentdir")]
    public string CurrentDir { get; set; }


    [JsonProperty("greetings")]
    public string Greetings { get; set; }


    [JsonProperty("prompt")]
    public string Prompt
    {
        get
        {
            string folder = !string.IsNullOrEmpty(CurrentDir) ? CurrentDir : "~";
            return $"{Username}@{MachineName}:{folder}$  ";
        }
    }
}