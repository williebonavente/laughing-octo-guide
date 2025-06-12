using Microsoft.AspNetCore.Mvc;

namespace YourAppNamespace.Controllers
{
    public class ResultsController : Controller
    {
        // GET: /Results/Results?wpm=0&cpm=7&accuracy=3
        public IActionResult PracticeResults(int wpm = 0, int cpm = 0, int accuracy = 0)
        {
            ViewBag.Wpm = wpm;
            ViewBag.Cpm = cpm;
            ViewBag.Accuracy = accuracy;
            return View();
        }
    }
}

